{\rtf1\ansi\ansicpg949\cocoartf2821
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset129 AppleSDGothicNeo-Regular;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh15980\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 export default async function handler(req, res) \{\
  if (req.method !== "POST") \{\
    return res.status(405).send("Method Not Allowed")\
  \}\
\
  const \{ paymentId \} = req.body\
\
  try \{\
    const response = await fetch(\
      `https://api.portone.io/payments/$\{paymentId\}`,\
      \{\
        headers: \{\
          Authorization: "eiHhpDQ4MGKgxxdLdDe9wZefk6EOkVKXkAuNeu6Yc0t2wsy2kqX7d4FFUSVho9d5sZ5HiD8y5B8EvhFC",\
        \},\
      \}\
    )\
\
    const data = await response.json()\
\
    if (data.status === "PAID") \{\
      return res.status(200).json(\{ status: "PAID" \})\
    \} else \{\
      return res.status(200).json(\{ status: data.status \})\
    \}\
  \} catch (e) \{\
    return res.status(500).send("
\f1 \'b0\'cb\'c1\'f5
\f0  
\f1 \'bd\'c7\'c6\'d0
\f0 ")\
  \}\
\}}