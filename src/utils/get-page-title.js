import defaultSettings from '@/settings'

// const title = defaultSettings.title || 'Vue Element Admin'
const title = 'ADCC'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    // return `${pageTitle} - ${title}`
    return `${pageTitle}`
  }
  return `${title}`
}
