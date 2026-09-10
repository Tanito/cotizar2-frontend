import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

export class PdfShareError extends Error {
  readonly userTitle: string;
  readonly userMessage: string;

  constructor(userTitle: string, userMessage: string, cause?: string) {
    super(cause ?? userMessage);
    this.name = "PdfShareError";
    this.userTitle = userTitle;
    this.userMessage = userMessage;
  }
}

/** Copies the PDF into app cache so expo-sharing can read it on Android/iOS. */
export async function prepareShareablePdfUri(uri: string): Promise<string> {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) {
    throw new PdfShareError(
      "PDF no encontrado",
      "No encontramos el archivo del presupuesto. Volvé al resumen y generá el PDF de nuevo.",
    );
  }

  const shareDir = `${FileSystem.cacheDirectory}share/`;
  const dirInfo = await FileSystem.getInfoAsync(shareDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(shareDir, { intermediates: true });
  }

  const targetUri = `${shareDir}cotizacion-${Date.now()}.pdf`;
  await FileSystem.copyAsync({ from: uri, to: targetUri });
  return targetUri;
}

export async function shareQuotePdf(pdfUri: string): Promise<void> {
  const available = await Sharing.isAvailableAsync();
  if (!available) {
    throw new PdfShareError(
      "Compartir no disponible",
      "Tu dispositivo no permite compartir archivos. Generá el PDF de nuevo desde el resumen.",
    );
  }

  if (!pdfUri.startsWith("file://")) {
    throw new PdfShareError(
      "PDF inválido",
      "Generá nuevamente el PDF desde el resumen para poder compartirlo.",
    );
  }

  const shareableUri = await prepareShareablePdfUri(pdfUri);

  try {
    await Sharing.shareAsync(shareableUri, {
      mimeType: "application/pdf",
      dialogTitle: "Enviar cotización por WhatsApp",
    });
  } catch {
    // Some Android targets reject mimeType/dialogTitle.
    await Sharing.shareAsync(shareableUri);
  }
}

export function alertPdfShareError(error: unknown): void {
  if (error instanceof PdfShareError) {
    Alert.alert(error.userTitle, error.userMessage);
    return;
  }

  const detail = error instanceof Error ? error.message : "";
  Alert.alert(
    "No se pudo compartir",
    detail
      ? `No pudimos abrir el menú para compartir el PDF.\n\n${detail}`
      : "Volvé al resumen, generá el PDF de nuevo e intentá otra vez.",
  );
}
