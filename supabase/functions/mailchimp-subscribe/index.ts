const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface SubscribeRequest {
  email: string;
}

interface MailchimpResponse {
  id?: string;
  email_address?: string;
  status?: string;
  title?: string;
  detail?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the request body
    const { email }: SubscribeRequest = await req.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Valid email address is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get Mailchimp credentials from environment variables
    const apiKey = Deno.env.get("MAILCHIMP_API_KEY");
    const audienceId = Deno.env.get("MAILCHIMP_AUDIENCE_ID");

    if (!apiKey || !audienceId) {
      console.error("Missing Mailchimp credentials");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extract datacenter from API key (format: key-dc)
    const datacenter = apiKey.split("-")[1];
    if (!datacenter) {
      console.error("Invalid Mailchimp API key format");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare Mailchimp API request
    const mailchimpUrl = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
    
    const mailchimpData = {
      email_address: email,
      status: "subscribed",
      tags: ["fill-in-fables-website"]
    };

    // Make request to Mailchimp API
    const mailchimpResponse = await fetch(mailchimpUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`anystring:${apiKey}`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mailchimpData),
    });

    const responseData: MailchimpResponse = await mailchimpResponse.json();

    // Handle Mailchimp response
    if (mailchimpResponse.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Successfully subscribed to newsletter!",
          email: responseData.email_address 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      // Handle specific Mailchimp errors
      if (responseData.title === "Member Exists") {
        return new Response(
          JSON.stringify({ 
            error: "This email is already subscribed to our newsletter!" 
          }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.error("Mailchimp API error:", responseData);
      return new Response(
        JSON.stringify({ 
          error: responseData.detail || "Failed to subscribe. Please try again." 
        }),
        {
          status: mailchimpResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

  } catch (error) {
    console.error("Error in mailchimp-subscribe function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});