// Streaming execution function - FIXED for FormData support
export async function handleExecutionStreaming(
  baseURL: string,
  payload: FormData | any,
  callback: (data: any, done: boolean) => void
): Promise<string> {
  const token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJIYmRlWmJDbS1DVGthZ2N5SnRvZVhZd2hJTS1OcW5ld0RKQWhvNjg4ZEJVIn0.eyJleHAiOjE3NTcxNDUyMzAsImlhdCI6MTc1Njg4NjAzMCwianRpIjoiOTc1MjI3YTQtMzk5Yy00Yjc1LTkwMzItMmExMmIyNGQyOGY2IiwiaXNzIjoiaHR0cHM6Ly91czEtZGV2LW5leGEua2FuaW1hbmdvLmNvbS9hdXRoL3JlYWxtcy9ibHVlbWVzaCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIxYzA3NTkyOS01ZWNiLTRjMDQtOTc4MC1lZTlmODg4MDFmZWUiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJibHVlbWVzaCIsInNlc3Npb25fc3RhdGUiOiJhMWI3YzhmZi01ZWQyLTRiMDUtYTIyZS1kNWY1M2IyN2M5N2IiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtYmx1ZW1lc2giLCJvZmZsaW5lX2FjY2VzcyIsInN1cGVyYWRtaW4iLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6ImExYjdjOGZmLTVlZDItNGIwNS1hMjJlLWQ1ZjUzYjI3Yzk3YiIsInRlbmFudF9pZCI6Ijg2NzBjZTQ3LWJlYWQtNDg2My04MWM4LTVlNTFmZTg0NGM3NyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJ0ZWxjb19pZCI6IjNjOTZmZTJhLTkwODgtNDg1MC05MGQzLWU4YTlkOTllYTQ4ZSIsIm5hbWUiOiJWaXNobnUgVCBBc29rIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidmlzaG51dGFzb2tAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6IlZpc2hudSIsImZhbWlseV9uYW1lIjoiVCBBc29rIiwiZW1haWwiOiJ2aXNobnV0YXNva0BnbWFpbC5jb20ifQ.JOn906-jYl9oBSGs4NW7Ut84nnLbtGs6gRMPCaytgjP8CC9kMNwKLaDOmjciYsQ3TnMHRwCB0VgbvHw4_Wt4_h0Y5n744eV5HdZWib9YBvVkpkVMsu-0rfARs25PHRtmFKhfLamD7BNq35AF3iq3dbeKMINoBZDCSOpDUqaJGyPJhiO7q6TzXR9cq4bsj4cWLn6AxV5fWsa70PRMRt58lSaSD9ebOYiDNBqqX438YjT08viJFe0rwDUjvVdDh9qm1BgaOCWHisA3nLSAod_K-I0KmCC5-iPKSLqBSilMTd3GtK_ODI4PwR_svjC14lj0bRRWZhY1DQ2175pjse6uiQ';
  console.log("handleExecutionStreaming called with payload:", payload);
  
  // FIXED: Handle FormData vs JSON payload differently
  const isFormData = payload instanceof FormData;
  
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };
  
  // FIXED: Don't set Content-Type for FormData - browser will set it with boundary
  let body;
  if (isFormData) {
    body = payload;
    // Don't set Content-Type - browser will set multipart/form-data with boundary
  } else {
    headers['Content-Type'] = 'application/json';
    body = typeof payload === "string" ? payload : JSON.stringify(payload);
  }
  
  const response = await fetch(baseURL, {
    method: "POST",
    headers,
    body,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  if (!response.body) throw new Error("No response body");
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let resultText = "";
  
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) {
      if (buffer.trim()) {
        try {
          const finalJson = JSON.parse(buffer.trim());
          resultText += finalJson?.content || "";
          callback(finalJson, true);
        } catch (e) {
          console.error("Final buffer parse error:", buffer, e);
        }
      } else {
        callback(null, true);
      }
      return resultText;
    }
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      try {
        const parsed = JSON.parse(trimmed);
        resultText += parsed?.content || "";
        callback(parsed, false);
      } catch (error) {
        console.error("Error parsing JSON line:", trimmed, error);
      }
    }
    
    // Small delay to prevent blocking
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

// Message creation utilities - FIXED type definitions
export function createUserMessage(
  content: string,
  type: 'text' | 'image' | 'audio',
  file?: string
): { id: number; role: 'user'; content: string; type: 'text' | 'image' | 'audio'; file?: string } {
  return {
    id: Date.now(),
    role: 'user',
    content,
    type,
    ...(file && { file })
  };
}

export function createAssistantMessage(
  content: string,
  type: 'text' | 'image' | 'audio',
  file?: string
): { id: number; role: 'assistant'; content: string; type: 'text' | 'image' | 'audio'; file?: string } {
  return {
    id: Date.now() + 1,
    role: 'assistant',
    content,
    type,
    ...(file && { file })
  };
}

export function createErrorMessage(
  content: string = 'Sorry, something went wrong.'
): { id: number; role: 'assistant'; content: string; type: 'text' } {
  return {
    id: Date.now() + 1,
    role: 'assistant',
    content,
    type: 'text'
  };
}

export function formatRecordingTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
}