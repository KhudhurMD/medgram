export const GA_MEASUREMENT_ID = 'G-6MECLLK8BX'

export const pageview = (url: string) => {
  // @ts-ignore
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}
export const event = ({ action, category, label, value }) => {
  // @ts-ignore
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}
