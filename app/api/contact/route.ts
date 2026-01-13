import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const inquiry = formData.get("inquiry") as string;
    const email = formData.get("email") as string;
    const note = formData.get("note") as string;
    const file = formData.get("file") as File | null;

    // 驗證必填欄位
    if (!name || !phone || !inquiry || !email) {
      return NextResponse.json(
        { error: "所有必填欄位都必須填寫" },
        { status: 400 }
      );
    }

    // 創建郵件傳輸器
    // 注意：您需要根據實際的郵件服務配置這些設定
    const smtpConfig = {
      host: process.env.SMTP_HOST || "msr.hinet.net",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      requireTLS: true, // 要求使用 TLS
      auth: {
        user: process.env.SMTP_USER || "yunseng.design@msa.hinet.net",
        pass: process.env.SMTP_PASSWORD || "",
      },
      tls: {
        rejectUnauthorized: false, // 允許自簽名證書
      },
    };

    console.log("SMTP 配置:", {
      host: smtpConfig.host,
      port: smtpConfig.port,
      user: smtpConfig.auth.user,
      hasPassword: !!smtpConfig.auth.pass,
    });

    const transporter = nodemailer.createTransport(smtpConfig);

    // 準備附件
    const attachments = [];
    if (file) {
      // 驗證檔案格式
      const allowedExtensions = [".ai", ".psd", ".pdf", ".jpeg", ".jpg", ".png"];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));
      
      if (!allowedExtensions.includes(fileExtension)) {
        return NextResponse.json(
          { error: "只接受 ai、psd、pdf、jpeg、png 格式的檔案" },
          { status: 400 }
        );
      }
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    // 郵件內容
    const mailOptions = {
      from: process.env.SMTP_USER || "yunseng.design@msa.hinet.net",
      to: "yunseng.design@msa.hinet.net",
      subject: `聯絡表單 - ${inquiry}`,
      html: `
        <h2>新的聯絡表單提交</h2>
        <p><strong>姓名：</strong>${name}</p>
        <p><strong>聯絡電話：</strong>${phone}</p>
        <p><strong>詢問項目：</strong>${inquiry}</p>
        <p><strong>電子信箱：</strong>${email}</p>
        ${note ? `<p><strong>備註：</strong>${note.replace(/\n/g, "<br>")}</p>` : ""}
        ${file ? `<p><strong>附件：</strong>${file.name}</p>` : ""}
      `,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    // 發送郵件
    console.log("準備發送郵件...");
    const info = await transporter.sendMail(mailOptions);
    console.log("郵件發送成功:", info.messageId);

    return NextResponse.json(
      { message: "表單已成功送出" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("郵件發送錯誤:", error);
    const err = error as { message?: string; code?: string; response?: unknown; command?: string };
    console.error("錯誤詳情:", {
      message: err.message,
      code: err.code,
      response: err.response,
      command: err.command,
    });
    
    // 返回更詳細的錯誤訊息
    const errorMessage = err.response
      ? `郵件伺服器錯誤: ${err.response}`
      : err.message
      ? `郵件發送失敗: ${err.message}`
      : "郵件發送失敗，請稍後再試或直接透過電話/Email 與我們聯絡";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

