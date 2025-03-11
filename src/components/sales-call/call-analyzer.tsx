"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Mic,
  FileText,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { createClient } from "../../../supabase/client";

type FeedbackSection = {
  title: string;
  items: string[];
  icon: React.ReactNode;
  color: string;
};

type CallAnalysis = {
  strengths: string[];
  improvements: string[];
  recommendations: string[];
};

export function CallAnalyzer() {
  const [activeTab, setActiveTab] = useState("upload");
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CallAnalysis | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // If it's an audio file, we'll need to transcribe it
      if (file.type.startsWith("audio/")) {
        setTranscript("Audio file will be transcribed before analysis.");
      }
    }
  };

  const handleTranscriptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTranscript(e.target.value);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const analyzeCall = async () => {
    setIsAnalyzing(true);

    try {
      let transcriptText = transcript;

      // If we have an audio file, transcribe it first
      if (uploadedFile && uploadedFile.type.startsWith("audio/")) {
        setIsTranscribing(true);
        transcriptText = await transcribeAudio(uploadedFile);
        setTranscript(transcriptText);
        setIsTranscribing(false);
      }

      // Now analyze the transcript
      const result = await analyzeTranscript(transcriptText);
      setAnalysis(result);
      setActiveTab("results");

      // Log activity for time saved tracking
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          await supabase.from("user_activity").insert({
            user_id: userData.user.id,
            activity_type: "call_analysis",
            details: { transcript_length: transcriptText.length },
          });
        }
      } catch (logError) {
        console.error("Error logging activity:", logError);
      }
    } catch (error) {
      console.error("Error analyzing call:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const transcribeAudio = async (audioFile: File): Promise<string> => {
    // In a real implementation, you would upload the file to a server
    // and use a service like OpenAI's Whisper API to transcribe it
    // For this demo, we'll simulate a transcription with a delay

    // Create a FormData object to upload the file
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("model", "whisper-1");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, return a mock transcript
      return "Hello, this is John from Insurance Sales Genie. I'm calling to discuss your insurance needs. Based on your profile, I think our Premium Health plan would be a great fit for you. It offers comprehensive coverage with a low deductible. What do you think about that? ... Yes, the monthly premium is $450. ... I understand your concern about the price. We do have a more affordable Basic Care plan at $250 per month, but it doesn't include dental and vision. ... Great, I'll send you more information about both plans. Is there anything specific you'd like to know about these plans?";
    } catch (error) {
      console.error("Error transcribing audio:", error);
      throw new Error("Failed to transcribe audio file");
    }
  };

  const analyzeTranscript = async (text: string): Promise<CallAnalysis> => {
    // Check if OpenAI API key is configured
    const openaiApiKey =
      process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    try {
      if (openaiApiKey) {
        // In a real implementation, this would call the OpenAI API with the transcript
        // For now, we'll continue with our simulated response
        console.log("OpenAI API key is configured for transcript analysis");

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        // Simulate API call delay if no OpenAI key
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // For demo purposes, return a mock analysis
      return {
        strengths: [
          "Good introduction with clear identification",
          "Offered product recommendations based on client profile",
          "Provided specific pricing information",
          "Offered alternative options when price concern was raised",
          "Ended with a clear next step (sending information)",
        ],
        improvements: [
          "Didn't ask enough discovery questions before recommending products",
          "Limited explanation of product benefits",
          "Didn't address potential health condition concerns",
          "Could have explored client's specific needs more deeply",
        ],
        recommendations: [
          "Start with more discovery questions before making recommendations",
          "Explain product benefits in more detail, connecting them to client needs",
          "Prepare responses for common objections beyond price",
          "Use more comparative language when presenting multiple options",
          "Add a specific call-to-action at the end of the conversation",
        ],
      };
    } catch (error) {
      console.error("Error analyzing transcript:", error);
      throw new Error("Failed to analyze transcript");
    }
  };

  const renderFeedbackSection = ({
    title,
    items,
    icon,
    color,
  }: FeedbackSection) => (
    <Card className="mb-4">
      <CardHeader className={`flex flex-row items-center gap-2 ${color}`}>
        {icon}
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="min-w-4 mt-1">
                <div
                  className={`h-2 w-2 rounded-full ${color.replace("text-", "bg-")}`}
                />
              </div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" disabled={isAnalyzing}>
            Upload & Analyze
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!analysis || isAnalyzing}>
            Analysis Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Call Analyzer</CardTitle>
              <CardDescription>
                Upload an audio recording or paste a transcript of your sales
                call for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={triggerFileInput}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="audio/mp3,audio/wav,audio/mpeg,text/plain"
                      className="hidden"
                    />
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium mb-1">
                      Upload audio or transcript file
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Drag and drop or click to browse
                      <br />
                      Supports MP3, WAV, and text files
                    </p>
                    {uploadedFile && (
                      <div className="mt-4 text-sm font-medium text-teal-600">
                        {uploadedFile.name}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Call Transcript</span>
                  </div>
                  <Textarea
                    placeholder="Paste your call transcript here..."
                    className="min-h-[200px]"
                    value={transcript}
                    onChange={handleTranscriptChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={analyzeCall}
                disabled={
                  isAnalyzing ||
                  (!transcript && !uploadedFile) ||
                  isTranscribing
                }
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isAnalyzing || isTranscribing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isTranscribing ? "Transcribing..." : "Analyzing..."}
                  </>
                ) : (
                  <>Analyze Call</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4 mt-4">
          {analysis && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Call Analysis Results</CardTitle>
                  <CardDescription>
                    AI-powered feedback on your sales call performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">
                      Call Transcript
                    </h3>
                    <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap">
                      {transcript}
                    </div>
                  </div>

                  {renderFeedbackSection({
                    title: "Strengths",
                    items: analysis.strengths,
                    icon: <CheckCircle className="h-5 w-5" />,
                    color: "text-green-600",
                  })}

                  {renderFeedbackSection({
                    title: "Areas for Improvement",
                    items: analysis.improvements,
                    icon: <AlertCircle className="h-5 w-5" />,
                    color: "text-amber-600",
                  })}

                  {renderFeedbackSection({
                    title: "Key Recommendations",
                    items: analysis.recommendations,
                    icon: <Lightbulb className="h-5 w-5" />,
                    color: "text-blue-600",
                  })}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setActiveTab("upload");
                      setTranscript("");
                      setUploadedFile(null);
                      setAnalysis(null);
                    }}
                  >
                    Start New Analysis
                  </Button>
                  <Button
                    onClick={() => {
                      // In a real app, this would save the analysis to the database
                      // For now, just show a success message
                      alert("Analysis saved successfully!");
                    }}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Save Analysis
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
