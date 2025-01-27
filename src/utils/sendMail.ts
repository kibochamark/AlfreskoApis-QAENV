import { url } from "./constants";
import { transporter } from "./NodeMailer";


// Format budget and price in GBP
const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
});


const sendEmail = async (email: string, token: string) => {
    const logoUrl = url + 'logo.jpg';  // Replace with your logo 

    const mailOptions = {
        from: process.env.EMAIL ?? "kibochamark@gmail.com",
        to: email,
        subject: "Password Reset Token",
        html: `
            <div style="font-family: Arial, sans-serif;">
                <img src="${logoUrl}" alt="Company Logo" style="max-width: 200px; margin-bottom: 20px;">
                <h3>Password Reset Token</h3>
                <p>Your password reset token is:</p>
                <p style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">${token}</p>
                <p>Please use this token to reset your password.</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendQuoteNotification = async (adminEmail: string, quoteDetails: any) => {
    const logoUrl = url + 'logo.jpg';; // Replace with your logo URL
    const { name, email, phone, address, dimensions,  canopyType, rooffeature, additionalfeatures, budget } = quoteDetails;



    const formattedBudget = formatter.format(budget);


    const mailOptions = {
        from: process.env.EMAIL ?? "info@alfresko.co.uk",
        to: adminEmail,
        subject: "🌟 New Quote Submission Alert",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f9f9f9; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 20px;">
        <img src="${logoUrl}" alt="Company Logo" style="max-width: 150px; border-radius: 4px;">
    </div>
    <h2 style="color: #4CAF50; font-size: 24px; text-align: center; margin-bottom: 10px;">🌟 New Quote Submission Alert</h2>
    <p style="text-align: center; font-size: 16px; color: #555; margin-bottom: 20px;">A new quote has been submitted by <strong>${name}</strong>. Here's a quick snapshot:</p>
    <ul style="list-style: none; padding: 0; margin: 0; font-size: 16px; color: #333;">
        <li style="background: #fff; padding: 10px 15px; border-radius: 6px; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"><strong>Address:</strong> ${address}</li>
        <li style="background: #fff; padding: 10px 15px; border-radius: 6px; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"><strong>Dimensions:</strong> ${dimensions}</li>
        <li style="background: #fff; padding: 10px 15px; border-radius: 6px; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"><strong>Canopy Type:</strong> ${canopyType}</li>
        <li style="background: #fff; padding: 10px 15px; border-radius: 6px; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"><strong>Roof Material:</strong> ${rooffeature}</li>
        <li style="background: #fff; padding: 10px 15px; border-radius: 6px; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"><strong>Additional Features:</strong> ${additionalfeatures}</li>
        <li style="background: #fff; padding: 10px 15px; border-radius: 6px; margin-bottom: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);"><strong>Budget:</strong>${formattedBudget}</li>
    </ul>
    <div style="margin-top: 20px; font-size: 16px; text-align: center;">
        <p>📞 <strong>Contact:</strong> <a href="mailto:${email}" style="color: #4CAF50; text-decoration: none;">${email}</a> | ${phone}</p>
        <p style="margin-top: 10px;">Cheers,</p>
    </div>
</div>

        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};



export const sendQuoteNotificationToClient = async (adminEmail: string, quoteDetails: any) => {
    const logoUrl = url + 'logo.jpg'; // Replace with your logo URL
    const { name, email, phone, address, dimensions, price, canopyType, rooffeature, additionalfeatures, budget, wallfeatures } = quoteDetails;

    const wallFeaturesList = wallfeatures.map(
        (feature: { name: string; description: string }) => `<li><strong>${feature.name}:</strong> ${feature.description}</li>`
    ).join("");



    const formattedBudget = formatter.format(budget);
    const formattedPrice = formatter.format(price);

    const mailOptions = {
        from: process.env.EMAIL ?? "info@alfresko.co.uk",
        to: adminEmail,
        subject: "Your Dream Canopy Quote is Ready",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <img src="${logoUrl}" alt="Company Logo" style="max-width: 200px; margin-bottom: 20px;">
                <h2>Your Dream Canopy Quote is Ready</h2>
                <p>Hi ${name},</p>
                <p>Based on the details you provided, here’s a sneak peek into your dream setup:</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone:</strong> ${phone}</p>
                <h3>✨ Project Highlights</h3>
                <p><strong>Address:</strong>${address}</p>
                <p><strong>Dimensions:</strong> Perfectly tailored at ${dimensions}</p>
                <p><strong>Canopy Type:</strong> ${canopyType}</p>
                <p><strong>Roof Material:</strong> ${rooffeature}</p>
                <p><strong>Extra Touches:</strong> ${additionalfeatures}</p>
                <p><strong>Budget:</strong>${formattedBudget}</p>
                <h3>🏠 Wall Features</h3>
                <ul>${wallFeaturesList}</ul>
                <p><strong>💰 Your Quote Price:</strong>${formattedPrice}</p>
                <h3>💡 What Happens Next?</h3>
                <p>This is just the beginning of creating your ideal canopy. If you’d like to tweak any details or add more features, simply hit "Reply," and we’ll update your quote.</p>
                <p>We can’t wait to make this dream a reality!</p>
                <h3>🌈 Why Choose Us?</h3>
                <ul>
                    <li><strong>Tailored Perfection:</strong> Every project is customized for you.</li>
                    <li><strong>Attention to Detail:</strong> From sleek designs to thoughtful touches, we’ve got you covered.</li>
                    <li><strong>Customer Delight:</strong> Your happiness fuels our passion!</li>
                </ul>
                <h3>📞 Contact Us</h3>
                <p>Feel free to reach out anytime.</p>
                <p>8, Willow Park, Langley Park, Durham DH7 9FF</p>
                <p>Email: <a href="mailto:info@alfresko.co.uk">info@alfresko.co.uk</a> | Phone: 07743896460</p>
                <p>Thank you for choosing Alfresko!</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


export default sendEmail;
