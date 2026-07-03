import { createServerFn } from '@tanstack/react-start'
import { fetchPromptById, fetchPrompts } from '@/lib/prompts/notion'

export const getPrompts = createServerFn({ method: 'GET' }).handler(async () => {
  return fetchPrompts()
})

export const getPrompt = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data }) => {
    return fetchPromptById(data)
  })
