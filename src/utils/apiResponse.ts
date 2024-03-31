import { Response } from 'express'

/**
 * Responde a uma requisição com um objeto padronizado.
 * @param {Response} res - O objeto de resposta do Express.
 * @param {number} statusCode - O código de status HTTP da resposta.
 * @param {string} message - A mensagem associada à resposta.
 * @param {boolean} success - Indica se a operação foi bem-sucedida.
 * @param {T | Record<string, never>} data - Os dados associados à resposta, ou um objeto vazio se nenhum dado for fornecido.
 * @template T
 */
export function apiResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  success: boolean,
  data: T | Record<string, never> = {},
): void {
  const responseData = {
    statusCode,
    message,
    success,
    data,
  }
  res.json(responseData)
}
