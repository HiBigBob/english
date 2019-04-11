import { apiHelper } from './api-helper'
import { throws } from 'smid'

describe('Verbs API', () => {
  it('can find verb', async () => {
    const api = await apiHelper()
    const result = await api.findVerb()

    expect(Array.isArray(result)).toBe(true)
  })

  it('can create and find verb', async () => {
    const api = await apiHelper()
    const created = await api.createVerb({ en: ['google'], fr: ['google'] })

    const result = await api.findByIdVerb(created._id)

    expect(result).toEqual(created)
    expect(!Array.isArray(created)).toBe(true)

    await api.removeVerb(created._id)
  })

  it('can remove verb', async () => {
    const api = await apiHelper()
    const created = await api.createVerb({ en: ['google'], fr: ['google'] })

    await api.removeVerb(created._id)
    const { response } = await throws(api.notFindByIdVerb(created._id))
    expect(response.status).toBe(404)
  })

  it('can edit verb', async () => {
    const api = await apiHelper()
    const create = { en: ['google'], fr: ['google'] }
    const created = await api.createVerb(create)

    const edit = {
      en: ['google edit'],
      fr: ['google edit']
    }

    await api.updateVerb(created._id, edit)
    const result = await api.findByIdVerb(created._id)

    expect(result).toEqual({
      ...created,
      ...edit
    })

    await api.removeVerb(created._id)
  })
})
