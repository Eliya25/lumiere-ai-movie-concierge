import { mkdir, rename, rm, rmdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(scriptDirectory, '..', '..')
const outputDirectory = join(projectRoot, 'docs')
const recordingDirectory = join(outputDirectory, '.demo-recording')
const outputPath = join(outputDirectory, 'lumiere-demo.webm')
const appUrl = process.env.DEMO_URL ?? 'https://lumiere-ai-movie-concierge.vercel.app'

await mkdir(recordingDirectory, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: 'dark',
  recordVideo: {
    dir: recordingDirectory,
    size: { width: 1440, height: 900 },
  },
})

const page = await context.newPage()
const video = page.video()

try {
  await page.goto(appUrl, { waitUntil: 'networkidle', timeout: 60_000 })
  await page.waitForTimeout(1_200)

  await page.getByRole('button', { name: 'A clever mystery for a rainy night' }).click()
  await page.waitForTimeout(900)
  await page.getByRole('button', { name: 'Find my movies' }).click()

  await page.getByRole('heading', { name: 'Selected for this moment' }).waitFor({ timeout: 60_000 })
  const firstMovie = page.locator('[role="button"][aria-label^="View details for"]').first()
  await firstMovie.scrollIntoViewIfNeeded()
  await page.waitForTimeout(2_200)

  await firstMovie.click()
  await page.getByRole('dialog').waitFor({ state: 'visible' })
  await page.waitForTimeout(3_000)
  await page.keyboard.press('Escape')
  await page.getByRole('dialog').waitFor({ state: 'hidden' })
  await page.waitForTimeout(1_200)
} finally {
  await page.close()
  await context.close()
  await browser.close()
}

if (!video) {
  throw new Error('Playwright did not create a video recording.')
}

const temporaryPath = await video.path()
await rm(outputPath, { force: true })
await rename(temporaryPath, outputPath)
await rmdir(recordingDirectory)

console.log(`Demo recorded at ${outputPath}`)
