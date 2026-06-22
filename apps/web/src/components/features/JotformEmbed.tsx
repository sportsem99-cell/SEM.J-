'use client'

export default function JotformEmbed({ formId }: { formId: string }) {
  return (
    <iframe
      src={`https://form.jotform.com/${formId}`}
      width="100%"
      style={{ minHeight: '800px', border: 'none' }}
      allowFullScreen
      allow="geolocation; microphone; camera"
      title="Jotform"
    />
  )
}
