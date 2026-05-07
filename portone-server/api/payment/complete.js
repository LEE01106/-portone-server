export default async function handler(req, res) {
  // 1. 모든 도메인에서 접속할 수 있도록 CORS 허용 설정
  res.setHeader('Access-Control-Allow-Origin', '*'); // 모든 도메인 허용
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. 브라우저가 미리 보내보는 '사전 요청(OPTIONS)' 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { paymentId, totalAmount } = req.body;

    // 3. 포트원 결제내역 단건조회
    const paymentResponse = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: { 
          Authorization: `PortOne ${process.env.PORTONE_API_SECRET}` 
        },
      }
    );

    if (!paymentResponse.ok) throw new Error("포트원 결제 조회 실패");
    const payment = await paymentResponse.json();

    // 4. 금액 검증 (전달받은 totalAmount와 포트원 금액 비교)
    if (Number(totalAmount) === payment.amount.total) {
      if (payment.status === "PAID") {
        return res.status(200).json({ status: "PAID" });
      }
      return res.status(200).json({ status: payment.status });
    } else {
      return res.status(400).send("결제 금액 불일치");
    }
  } catch (e) {
    console.error(e);
    return res.status(400).send(e.message);
  }
}
