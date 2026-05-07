// 서버 코드(complete.js) 맨 위에 추가
res.setHeader('Access-Control-Allow-Origin', '*'); 
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') return res.status(200).end();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    // paymentId와 함께 해당 상품의 진짜 가격(amount)을 같이 받습니다.
    const { paymentId, totalAmount } = req.body; 

    const paymentResponse = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: { Authorization: `PortOne ${process.env.PORTONE_API_SECRET}` },
      }
    );

    if (!paymentResponse.ok) throw new Error("결제 조회 실패");
    const payment = await paymentResponse.json();

    // 이제 고정된 1000원이 아니라, 프레이머에서 보내준 가격과 비교합니다.
    if (Number(totalAmount) === payment.amount.total) {
      if (payment.status === "PAID") {
        return res.status(200).json({ status: "PAID" });
      }
      return res.status(200).json({ status: payment.status });
    } else {
      return res.status(400).send("결제 금액 불일치");
    }
  } catch (e) {
    return res.status(400).send(e.message);
  }
}
