// Verification Email
module.exports = ({ user, verificationURL }) => {

    // SF Pro on Apple devices, Inter where supported, native system fonts elsewhere.
    const font = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif`;

    const color = {
        page: '#08070c',
        card: '#0b0a11',
        border: '#1e1c28',
        tile: '#100f17',
        tileBorder: '#211f2b',
        divider: '#1a1921',
        eyebrow: '#c4b5fd',
        headline: '#ffffff',
        text: '#a09dab',
        label: '#8a8794',
        value: '#ffffff',
        link: '#c4b5fd',
        muted: '#76737f',
        footer: '#55525d',
        icon: '#e0e7ff',
        badge: '#18152d'
    };

    // Solid fill that's also drawn as a gradient: the Gmail app's dark mode recolors plain colors but leaves gradients alone.
    const paint = (hex) => `background-color: ${hex}; background-image: linear-gradient(${hex}, ${hex});`;

    // Corner glows from the auth page (solid page color is the fallback).
    const glow = `radial-gradient(circle at 0% 0%, rgba(168, 85, 247, 0.20), rgba(168, 85, 247, 0) 38%), radial-gradient(circle at 100% 100%, rgba(79, 70, 229, 0.20), rgba(79, 70, 229, 0) 38%)`;

    // Orbit rings around the badge: thin circles made from hard color stops.
    const rings = [[66, 0.30], [104, 0.20], [146, 0.13], [192, 0.08], [242, 0.05]]
        .map(([radius, alpha]) => `rgba(196, 181, 253, 0) ${radius - 1}px, rgba(196, 181, 253, ${alpha}) ${radius - 0.4}px, rgba(196, 181, 253, ${alpha}) ${radius + 0.4}px, rgba(196, 181, 253, 0) ${radius + 1}px`)
        .join(', ');

    // Hero art, drawn only with CSS gradients (top layer first). Clients without gradients show a solid violet.
    const layers = [
        // Fade into the card
        { image: 'linear-gradient(180deg, rgba(11, 10, 17, 0) 58%, rgba(11, 10, 17, 0.85) 88%, #0b0a11 100%)' },
        // Glow behind the badge
        { image: 'radial-gradient(circle 120px at 50% 132px, rgba(139, 92, 246, 0.55) 0%, rgba(139, 92, 246, 0.18) 45%, rgba(139, 92, 246, 0) 100%)' },
        // Orbit dots
        { image: 'radial-gradient(circle at 65.8% 68px, #c4b5fd 0px, #c4b5fd 2.5px, rgba(196, 181, 253, 0.16) 3.3px, rgba(196, 181, 253, 0) 7px)' },
        { image: 'radial-gradient(circle at 24.6% 70px, #a5b4fc 0px, #a5b4fc 2px, rgba(196, 181, 253, 0.16) 2.8px, rgba(196, 181, 253, 0) 5.8px)' },
        { image: 'radial-gradient(circle at 86.5% 105px, #ddd6fe 0px, #ddd6fe 1.5px, rgba(196, 181, 253, 0.16) 2.3px, rgba(196, 181, 253, 0) 4.6px)' },
        { image: 'radial-gradient(circle at 25.2% 200px, #c4b5fd 0px, #c4b5fd 1.5px, rgba(196, 181, 253, 0.16) 2.3px, rgba(196, 181, 253, 0) 4.6px)' },
        // Orbit rings
        { image: `radial-gradient(circle at 50% 132px, rgba(196, 181, 253, 0) 0px, ${rings})` },
        // Aurora
        { image: 'radial-gradient(ellipse 70% 90% at 12% -20%, rgba(168, 85, 247, 0.75) 0%, rgba(168, 85, 247, 0) 60%)' },
        { image: 'radial-gradient(ellipse 60% 80% at 92% -15%, rgba(79, 70, 229, 0.70) 0%, rgba(79, 70, 229, 0) 60%)' },
        { image: 'radial-gradient(ellipse 55% 70% at 50% 132px, rgba(124, 58, 237, 0.42) 0%, rgba(124, 58, 237, 0) 70%)' },
        // Fades the grid out toward the edges
        { image: 'radial-gradient(ellipse 62% 78% at 50% 132px, rgba(19, 15, 44, 0) 0%, rgba(19, 15, 44, 0.55) 45%, #130f2c 75%)' },
        // Grid
        { image: 'linear-gradient(0deg, rgba(255, 255, 255, 0.055) 1px, rgba(255, 255, 255, 0) 1px)', size: '26px 26px', position: '50% 2px', repeat: 'repeat' },
        { image: 'linear-gradient(90deg, rgba(255, 255, 255, 0.055) 1px, rgba(255, 255, 255, 0) 1px)', size: '26px 26px', position: '50% 2px', repeat: 'repeat' },
        // Base
        { image: 'linear-gradient(180deg, #1d1446 0%, #0b0a11 100%)' }
    ];

    const hero = {
        image: layers.map((layer) => layer.image).join(', '),
        size: layers.map((layer) => layer.size || '100% 100%').join(', '),
        position: layers.map((layer) => layer.position || '0 0').join(', '),
        repeat: layers.map((layer) => layer.repeat || 'no-repeat').join(', ')
    };

    // Envelope flap: two diagonal strokes drawn with gradients.
    const icon = {
        image: `linear-gradient(to top right, rgba(224, 231, 255, 0) 44%, ${color.icon} 44%, ${color.icon} 55%, rgba(224, 231, 255, 0) 55%), linear-gradient(to top left, rgba(224, 231, 255, 0) 44%, ${color.icon} 44%, ${color.icon} 55%, rgba(224, 231, 255, 0) 55%)`,
        size: '50% 66%, 50% 66%',
        position: '0 0, 100% 0'
    };

    return {
        subject: 'Verify your Kairo account',
        text: `Confirm your email

Hi ${user.username}, welcome to Kairo. Confirm your email to finish setting up your account and start your first escrow.

Verify email address:
${verificationURL}

Expires: in 24 hours
Single use: Yes

Didn't create a Kairo account? You can safely ignore this email.

Kairo · Secure peer-to-peer escrow on Solana
This email was sent to ${user.email}. Kairo will never ask for your password by email.`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
    <title></title>
    <style>
        /* Gmail app dark mode turns white text dark but leaves gradients alone; these wrappers keep the wordmark white there and do nothing elsewhere */
        u + .body .blend-screen { background: #000000; mix-blend-mode: screen; }
        u + .body .blend-difference { background: #000000; mix-blend-mode: difference; }

        /* Gmail on Android ignores gradients written inline, so they are repeated here */
        .hero { background-image: ${hero.image}; background-size: ${hero.size}; background-position: ${hero.position}; background-repeat: ${hero.repeat}; }
        .icon { background-image: ${icon.image}, linear-gradient(${color.badge}, ${color.badge}); background-size: ${icon.size}, 100% 100%; background-position: ${icon.position}, 0 0; background-repeat: no-repeat; }

        @media only screen and (max-width: 560px) {
            .outer { padding: 20px 10px 28px 10px !important; }
            .content { padding: 6px 24px 30px 24px !important; }
            .headline { font-size: 24px !important; line-height: 30px !important; }
            .text { font-size: 14px !important; line-height: 22px !important; }
        }
    </style>
</head>
<body class="body" style="margin: 0; padding: 0; background-color: ${color.page}; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%;">

    <div role="article" aria-roledescription="email" aria-label="Verify your Kairo account" lang="en">

    <!-- Preview text shown in the inbox list -->
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; mso-hide: all;">
        Confirm your email to finish setting up your Kairo account.&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;
    </div>

    <!-- Page -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${color.page}" style="background-color: ${color.page}; background-image: ${glow};">
        <tr>
            <td class="outer" align="center" style="text-align: center !important; padding: 44px 16px 40px 16px;">

                <!--[if mso]><table role="presentation" width="520" align="center" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;"><tr><td><![endif]-->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto; max-width: 520px;">

                    <!-- Card -->
                    <tr>
                        <td>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${color.card}" style="background-color: ${color.card}; border: 1px solid ${color.border}; border-radius: 20px; overflow: hidden; border-collapse: separate !important; border-spacing: 0;">

                                <!-- Hero -->
                                <tr>
                                    <td class="hero" bgcolor="#191338" style="background-color: #191338; background-image: ${hero.image}; background-size: ${hero.size}; background-position: ${hero.position}; background-repeat: ${hero.repeat}; border-radius: 20px 20px 0 0; padding: 22px 28px 0 28px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                                            <!-- Wordmark -->
                                            <tr>
                                                <td align="left" style="text-align: left !important; font-family: ${font}; font-size: 19px; line-height: 24px; font-weight: 700; letter-spacing: -0.5px; color: #ffffff;">
                                                    <div class="blend-screen"><div class="blend-difference">Kairo.</div></div>
                                                </td>
                                            </tr>

                                            <!-- Badge -->
                                            <tr>
                                                <td align="center" style="text-align: center !important; padding: 38px 0 60px 0;">
                                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto; border-collapse: separate !important; border-spacing: 0;">
                                                        <tr>
                                                            <td style="padding: 7px; border-radius: 31px; background-color: #25184e; background-color: rgba(124, 58, 237, 0.12); border: 1px solid #2a234c; border: 1px solid rgba(196, 181, 253, 0.10);">
                                                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse: separate !important; border-spacing: 0;">
                                                                    <tr>
                                                                        <td align="center" valign="middle" width="78" height="78" bgcolor="#16132a" style="text-align: center !important; vertical-align: middle !important; width: 78px; height: 78px; border-radius: 24px; border: 1px solid #7c3aed; border-top-color: #a78bfa; border-left-color: #8b5cf6; border-right-color: #6d28d9; border-bottom-color: #5b4bd8; background-color: #16132a; background-image: linear-gradient(180deg, #221d40 0%, #0f0d1a 100%); box-shadow: 0 22px 48px -8px rgba(109, 40, 217, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.16);">
                                                        <!--[if mso]><span style="font-family: 'Segoe UI Symbol', 'Segoe UI', sans-serif; font-size: 20px; line-height: 24px; color: #e0e7ff;">&#9993;</span><![endif]-->
                                                        <!--[if !mso]><!-->
                                                        <!-- Envelope: light box with a dark box inside, flap drawn on the dark box -->
                                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto; border-collapse: separate !important; border-spacing: 0;">
                                                            <tr>
                                                                <td style="padding: 2px; border-radius: 6px; font-size: 0; line-height: 0; ${paint(color.icon)}">
                                                                    <div class="icon" style="width: 26px; height: 18px; border-radius: 4px; background-color: ${color.badge}; background-image: ${icon.image}, linear-gradient(${color.badge}, ${color.badge}); background-size: ${icon.size}, 100% 100%; background-position: ${icon.position}, 0 0; background-repeat: no-repeat;"></div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <!--<![endif]-->
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                        </table>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td class="content" align="center" style="text-align: center !important; padding: 6px 44px 40px 44px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                                            <!-- Eyebrow -->
                                            <tr>
                                                <td align="center" style="text-align: center !important; padding-bottom: 12px; font-family: ${font}; font-size: 11px; line-height: 16px; font-weight: 600; letter-spacing: 1.6px; text-transform: uppercase; color: ${color.eyebrow};">
                                                    Email verification
                                                </td>
                                            </tr>

                                            <!-- Headline -->
                                            <tr>
                                                <td class="headline" align="center" style="text-align: center !important; padding-bottom: 12px; font-family: ${font}; font-size: 28px; line-height: 34px; font-weight: 700; letter-spacing: -0.8px; color: ${color.headline};">
                                                    Confirm your email
                                                </td>
                                            </tr>

                                            <!-- Text -->
                                            <tr>
                                                <td class="text" align="center" style="text-align: center !important; padding-bottom: 30px; font-family: ${font}; font-size: 15px; line-height: 24px; color: ${color.text};">
                                                    <span style="color: ${color.headline};">Hi ${user.username},</span> welcome to Kairo. Confirm your email to finish setting up your account and start your first escrow.
                                                </td>
                                            </tr>

                                            <!-- Button -->
                                            <tr>
                                                <td style="padding-bottom: 24px;">
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: separate !important; border-spacing: 0;">
                                                        <tr>
                                                            <td bgcolor="#ffffff" align="center" style="text-align: center !important; border-radius: 10px; box-shadow: 0 8px 24px -10px rgba(196, 181, 253, 0.45); mso-padding-alt: 15px 24px;">
                                                                <a href="${verificationURL}" target="_blank" style="display: block; padding: 15px 24px; mso-padding-alt: 0; font-family: ${font}; font-size: 15px; line-height: 20px; font-weight: 600; color: #0b0a10; text-align: center; text-decoration: none; border-radius: 10px;">
                                                                    Verify email address
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Details -->
                                            <tr>
                                                <td style="padding-bottom: 26px;">
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${color.tile}" style="background-color: ${color.tile}; border: 1px solid ${color.tileBorder}; border-radius: 12px; border-collapse: separate !important; border-spacing: 0;">
                                                        <tr>
                                                            <td align="left" style="text-align: left !important; padding: 14px 18px; font-family: ${font}; font-size: 13px; line-height: 18px; color: ${color.label};">Expires</td>
                                                            <td align="right" style="text-align: right !important; padding: 14px 18px; font-family: ${font}; font-size: 13px; line-height: 18px; font-weight: 500; color: ${color.value};">in 24 hours</td>
                                                        </tr>
                                                        <tr>
                                                            <td align="left" style="text-align: left !important; padding: 14px 18px; border-top: 1px solid ${color.divider}; font-family: ${font}; font-size: 13px; line-height: 18px; color: ${color.label};">Single use</td>
                                                            <td align="right" style="text-align: right !important; padding: 14px 18px; border-top: 1px solid ${color.divider}; font-family: ${font}; font-size: 13px; line-height: 18px; font-weight: 500; color: ${color.value};">Yes</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>

                                            <!-- Fallback link -->
                                            <tr>
                                                <td align="center" style="text-align: center !important; padding-bottom: 26px; font-family: ${font}; font-size: 12px; line-height: 19px; color: ${color.muted};">
                                                    Button not working? Paste this link into your browser:<br>
                                                    <a href="${verificationURL}" target="_blank" style="color: ${color.link}; text-decoration: none; word-break: break-all;">${verificationURL}</a>
                                                </td>
                                            </tr>

                                            <!-- Footnote -->
                                            <tr>
                                                <td align="center" style="text-align: center !important; padding-top: 22px; border-top: 1px solid ${color.divider}; font-family: ${font}; font-size: 12.5px; line-height: 20px; color: ${color.muted};">
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
                        <td align="center" style="text-align: center !important; padding: 30px 24px 0 24px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="text-align: center !important; padding-bottom: 8px; font-family: ${font}; font-size: 15px; line-height: 20px; font-weight: 700; letter-spacing: -0.4px; color: #8f8c99;">
                                        Kairo.
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="text-align: center !important; font-family: ${font}; font-size: 12px; line-height: 19px; color: ${color.footer};">
                                        Secure peer-to-peer escrow on Solana<br>
                                        This email was sent to <span style="color: ${color.muted};">${user.email}</span>.<br>
                                        Kairo will never ask for your password by email.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
                <!--[if mso]></td></tr></table><![endif]-->

            </td>
        </tr>
    </table>

    </div>

</body>
</html>
        `
    };
};