import { z } from 'zod';

/**
 * cjlint defect levels
 * - MANDATORY: Required fixes (errors)
 * - SUGGESTIONS: Optional improvements (notes)
 */
export const DefectLevelSchema = z.enum(['MANDATORY', 'SUGGESTIONS']);

/**
 * Schema for a single cjlint diagnostic result
 */
export const CangjieResultSchema = z.object({
  file: z.string().min(1),
  line: z.number().int().positive(),
  column: z.number().int().positive(),
  endLine: z.number().int().positive().optional(),
  endColumn: z.number().int().positive().optional(),
  analyzerName: z.string().default('cangjieCodeCheck'),
  description: z.string().min(1),
  defectLevel: DefectLevelSchema,
  defectType: z.string().min(1),
  language: z.string().default('cangjie'),
});

export const CangjieResultArraySchema = z.array(CangjieResultSchema);

export type CangjieResult = z.infer<typeof CangjieResultSchema>;
export type DefectLevel = z.infer<typeof DefectLevelSchema>;

export function parseCangjieResults(data: unknown): CangjieResult[] {
  return CangjieResultArraySchema.parse(data);
}

export function safeParseCangjieResults(data: unknown) {
  return CangjieResultArraySchema.safeParse(data);
}
