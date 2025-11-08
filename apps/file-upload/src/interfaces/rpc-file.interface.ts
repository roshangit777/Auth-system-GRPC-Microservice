export interface RpcFile extends Omit<Express.Multer.File, 'buffer'> {
  buffer: Buffer | { type: string; data: number[] };
}
