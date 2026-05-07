export default async function handler(req, res) {
  // 1. POST 요청이 아니면 거절
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { paymentId } = req.body; 

    // 2. 포트원 결제내역 단건조회 API 호출
    const paymentResponse = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: { 
          // Vercel 환경변수에 등록한 이름과 똑같아야 함
          Authorization: `PortOne ${process.env.PORTONE_API_SECRET}` 
        },
      }
    );

    if (!paymentResponse.ok) throw new Error("결제 조회 실패");
    const payment = await paymentResponse.json();

    // 3. 금액 검증 (나이키 운동화 가격 1000원 기준)
    const orderAmount = 1000; 

    if (orderAmount === payment.amount.total) {
      switch (payment.status) {
        case "PAID":
          return res.status(200).json({ status: "PAID" });
        case "VIRTUAL_ACCOUNT_ISSUED":
          return res.status(200).json({ status: "READY" });
        default:
          return res.status(200).json({ status: payment.status });
      }
    } else {
      return res.status(400).send("결제 금액 불일치");
    }
  } catch (e) {
    return res.status(400).send(e.message);
  }
}
