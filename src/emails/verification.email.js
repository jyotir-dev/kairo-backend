// Verification Email
module.exports = ({ verificationURL }) => {

    // SF Pro on Apple devices, Inter where supported, native system fonts elsewhere.
    const font = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif`;

    const color = {
        page: '#030305',
        surface: '#121119',
        border: '#262431',
        cell: '#1b1a24',
        divider: '#262431',
        label: '#ffffff',
        body: '#b4b4bd',
        muted: '#8b8b94',
        value: '#e4e4e7',
        link: '#ececf1'
    };

    // Aurora mesh header (solid violet fallback for clients without gradient support).
    const aurora = `background-color: #2e1065; background-image: radial-gradient(circle at 8% 18%, #a855f7 0%, rgba(168, 85, 247, 0) 52%), radial-gradient(circle at 88% 12%, #ec4899 0%, rgba(236, 72, 153, 0) 46%), radial-gradient(circle at 62% 105%, #4f46e5 0%, rgba(79, 70, 229, 0) 58%);`;


    return {
        subject: 'Verify your Kairo account',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
    <title>Verify your Kairo account</title>
    <style>
        @media only screen and (max-width: 520px) {
            .outer { padding: 20px 12px !important; }
            .header { padding: 24px 22px 26px 22px !important; }
            .spacer { padding-bottom: 52px !important; }
            .content { padding: 26px 22px 26px 22px !important; }
            .title { font-size: 28px !important; line-height: 32px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${color.page}; -webkit-font-smoothing: antialiased;">

    <!-- Preview text shown in the inbox list -->
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
        Confirm your email address to finish setting up your Kairo account.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${color.page}" style="background-color: ${color.page};">
        <tr>
            <td class="outer" align="center" style="padding: 48px 20px; font-family: ${font};">

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 460px;">

                    <!-- Card -->
                    <tr>
                        <td>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid ${color.border}; border-radius: 22px; overflow: hidden; border-collapse: separate;">

                                <!-- Aurora header -->
                                <tr>
                                    <td class="header" bgcolor="#2e1065" style="${aurora} padding: 26px 32px 30px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.10);">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td class="spacer" style="padding-bottom: 64px; font-size: 18px; line-height: 22px; font-weight: 700; letter-spacing: -0.5px; color: ${color.label};">
                                                    Kairo
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="title" style="font-size: 32px; line-height: 36px; font-weight: 700; letter-spacing: -1.1px; color: ${color.label};">
                                                    Verify your<br>email
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td class="content" bgcolor="${color.surface}" style="background-color: ${color.surface}; padding: 30px 32px 30px 32px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                                            <!-- Body -->
                                            <tr>
                                                <td style="padding-bottom: 24px; font-size: 15px; line-height: 24px; color: ${color.body};">
                                                    Confirm this is your email address to finish setting up your Kairo account.
                                                </td>
                                            </tr>

                                            <!-- Button -->
                                            <tr>
                                                <td style="padding-bottom: 28px;">
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="center" style="border-radius: 12px;">
                                                                <a href="${verificationURL}" target="_blank" style="display: block; padding: 14px 22px; text-align: center; font-family: ${font}; font-size: 15px; line-height: 20px; font-weight: 600; color: #0b0a10; text-decoration: none; border-radius: 12px;">
                                                                    Verify email address
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Divider -->
                                            <tr>
                                                <td style="padding-bottom: 18px;">
                                                    <div style="height: 1px; line-height: 1px; font-size: 1px; background-color: ${color.divider};">&nbsp;</div>
                                                </td>
                                            </tr>

                                            <!-- Details -->
                                            <tr>
                                                <td style="padding-bottom: 22px;">
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; line-height: 20px;">
                                                        <tr>
                                                            <td style="padding-bottom: 8px; color: ${color.muted};">Expires</td>
                                                            <td align="right" style="padding-bottom: 8px; color: ${color.value};">in 24 hours</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="color: ${color.muted};">Single use</td>
                                                            <td align="right" style="color: ${color.value};">Yes</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Fallback link -->
                                            <tr>
                                                <td bgcolor="${color.cell}" style="background-color: ${color.cell}; border: 1px solid ${color.border}; border-radius: 12px; padding: 12px 14px; font-size: 12px; line-height: 18px;">
                                                    <span style="color: ${color.muted};">Button not working? Copy this link into your browser:</span><br>
                                                    <a href="${verificationURL}" target="_blank" style="color: ${color.link}; text-decoration: none; word-break: break-all;">${verificationURL}</a>
                                                </td>
                                            </tr>

                                            <!-- Footnote -->
                                            <tr>
                                                <td style="padding-top: 18px; font-size: 12px; line-height: 18px; color: ${color.muted};">
                                                    Didn't create a Kairo account? You can safely ignore this email.
                                                </td>
                                            </tr>

                                        </table>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding-top: 24px; font-size: 11px; line-height: 17px; color: ${color.muted};">
                            Kairo &middot; Secure peer-to-peer escrow on Solana<br>
                            You're receiving this because of activity on your Kairo account.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
        `
    };
};