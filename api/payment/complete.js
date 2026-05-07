export default async function handler(req, res) {
  // 모든 도메인에서의 접속을 허용 (모바일/PC 통신 에러 해결)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { paymentId, totalAmount } = req.body;

    const paymentResponse = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: { Authorization: `PortOne ${process.env.PORTONE_API_SECRET}` },
      }
    );

    const payment = await paymentResponse.json();
    if (!paymentResponse.ok) return res.status(400).json({ message: "포트원 조회 실패", detail: payment });

    // 금액 검증
    if (Number(totalAmount) === payment.amount.total) {
      return res.status(200).json({ status: payment.status });
    } else {
      return res.status(400).json({ status: "FORGERY", message: "금액 불일치" });
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}
