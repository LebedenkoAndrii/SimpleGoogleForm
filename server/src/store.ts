export interface Form {
  id: string
  title: string
  description: string | null
  createdAt: string
}

export const store = {
  forms: [] as Form[],
}
