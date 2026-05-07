export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  try {
    const { paymentId, totalAmount } = req.body;
    // 1. Secret Key 가져오기 (공백 제거 필수)
    const SECRET = process.env.PORTONE_API_SECRET ? process.env.PORTONE_API_SECRET.trim() : "";

    // 2. 포트원 호출
    const paymentResponse = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId.trim())}`,
      {
        headers: { 
          "Authorization": `PortOne ${SECRET}`,
          "Content-Type": "application/json"
        },
      }
    );

    const payment = await paymentResponse.json();

    // 포트원 응답이 OK가 아닐 때 상세 에러를 반환합니다.
    if (!paymentResponse.ok) {
      return res.status(400).json({ 
        message: "포트원 API 거절", 
        reason: payment.message, // 포트원이 알려주는 진짜 이유
        code: payment.code 
      });
    }

    if (Number(totalAmount) === payment.amount.total) {
      return res.status(200).json({ status: payment.status });
    } else {
      return res.status(400).json({ status: "FORGERY", message: "금액 불일치" });
    }
  } catch (e) {
    return res.status(500).json({ message: "서버 내부 에러: " + e.message });
  }
}
