import OpenAI from "openai";

// Initialize the OpenAI client with the API key from environment variables
let openai: OpenAI | null = null;

export const getOpenAIClient = () => {
  // Only create a new client if one doesn't exist and if the API key is available
  if (typeof window !== "undefined" && !openai) {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (apiKey) {
      openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true, // Required for client-side usage
      });
    }
  }

  return openai;
};

export const getAssistantId = () => {
  return process.env.NEXT_PUBLIC_OPENAI_ASSISTANT_ID;
};

// Function to create a thread and send a message to the OpenAI Assistant
export const sendMessageToAssistant = async (
  message: string,
  context?: any,
) => {
  const client = getOpenAIClient();
  const assistantId = getAssistantId();

  if (!client || !assistantId) {
    throw new Error("OpenAI client or Assistant ID not configured");
  }

  try {
    console.log("Sending message to OpenAI Assistant:", message);
    console.log("Using Assistant ID:", assistantId);

    // Create a thread with the OpenAI-Beta header for v2
    const thread = await client.beta.threads.create({
      headers: {
        "OpenAI-Beta": "assistants=v2",
      },
    });
    console.log("Created thread:", thread.id);

    // Add a message to the thread with the OpenAI-Beta header for v2
    await client.beta.threads.messages.create(
      thread.id,
      {
        role: "user",
        content: message,
      },
      {
        headers: {
          "OpenAI-Beta": "assistants=v2",
        },
      },
    );
    console.log("Added message to thread");

    // Prepare context as additional instructions if available
    let additionalInstructions = "";
    if (context) {
      additionalInstructions = `Here is additional context that might be helpful:\n\nInsurance Plans: ${JSON.stringify(context.insurancePlans)}\n\nHealth Conditions: ${JSON.stringify(context.healthConditions)}\n\nMedications: ${JSON.stringify(context.medications)}`;
    }

    // Run the assistant on the thread with the OpenAI-Beta header for v2
    const run = await client.beta.threads.runs.create(
      thread.id,
      {
        assistant_id: assistantId,
        instructions: additionalInstructions
          ? additionalInstructions
          : undefined,
      },
      {
        headers: {
          "OpenAI-Beta": "assistants=v2",
        },
      },
    );
    console.log("Started run:", run.id);

    // Wait for the run to complete with the OpenAI-Beta header for v2
    let runStatus = await client.beta.threads.runs.retrieve(thread.id, run.id, {
      headers: {
        "OpenAI-Beta": "assistants=v2",
      },
    });
    console.log("Initial run status:", runStatus.status);

    while (runStatus.status !== "completed") {
      if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
        throw new Error(`Run ended with status: ${runStatus.status}`);
      }

      // Wait for a second before checking again
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await client.beta.threads.runs.retrieve(thread.id, run.id, {
        headers: {
          "OpenAI-Beta": "assistants=v2",
        },
      });
      console.log("Updated run status:", runStatus.status);
    }

    // Get the messages from the thread with the OpenAI-Beta header for v2
    const messages = await client.beta.threads.messages.list(thread.id, {
      headers: {
        "OpenAI-Beta": "assistants=v2",
      },
    });
    console.log("Retrieved messages");

    // Find the last assistant message
    const assistantMessages = messages.data.filter(
      (m) => m.role === "assistant",
    );
    if (assistantMessages.length === 0) {
      throw new Error("No response from assistant");
    }

    // Get the content of the last assistant message
    const lastMessage = assistantMessages[0];
    let responseText = "";

    for (const content of lastMessage.content) {
      if (content.type === "text") {
        responseText += content.text.value;
      }
    }

    console.log("Assistant response received");
    return responseText;
  } catch (error) {
    console.error("Error sending message to OpenAI Assistant:", error);
    throw error;
  }
};
