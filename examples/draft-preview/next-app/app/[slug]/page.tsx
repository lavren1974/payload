import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import type { Page as PageType } from '../../payload-types'
import { fetchPage } from '../_api/fetchPage'
import { fetchPages } from '../_api/fetchPages'
import { Gutter } from '../_components/Gutter'
import RichText from '../_components/RichText'

import classes from './index.module.scss'

interface PageParams {
  params: Promise<{
    slug?: string
  }>
}

export const PageTemplate: React.FC<{ page: null | PageType | undefined }> = ({ page }) => (
  <main className={classes.page}>
    <Gutter>
      <h1>{page?.title}</h1>
      <RichText content={page?.richText} />
    </Gutter>
  </main>
)

export default async function Page({ params }: PageParams) {
  const { slug = 'home' } = await params

  const { isEnabled: isDraftMode } = await draftMode()

  const page = await fetchPage(slug, isDraftMode)

  if (page === null) {
    return notFound()
  }

  return <PageTemplate page={page} />
}

export async function generateStaticParams() {
  const pages = await fetchPages()

  return pages.map(({ slug }) =>
    slug !== 'home'
      ? {
          slug,
        }
      : {},
  ) // eslint-disable-line function-paren-newline
}
