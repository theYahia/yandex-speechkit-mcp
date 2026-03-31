export interface RecognizeResponse {
  result: string;
}

export interface SynthesizeParams {
  text: string;
  lang: string;
  voice: string;
  format: string;
  folderId: string;
}
