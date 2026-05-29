export function createCsv(rows = []) {
  if (!rows.length) {
    return ''
  }

  const headers = Object.keys(rows[0])
  const escape = (value) => {
    const stringValue = `${value ?? ''}`
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }

  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(',')),
  ].join('\n')
}

export function createPrintableReport(title, summary, rows) {
  const summaryHtml = summary
    .map(
      (item) =>
        `<div style="padding:16px;border:1px solid #e2e8f0;border-radius:16px;background:#f8fafc">
          <div style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#64748b">${item.label}</div>
          <div style="margin-top:8px;font-size:24px;color:#0f172a">${item.value}</div>
        </div>`,
    )
    .join('')

  const columns = rows.length ? Object.keys(rows[0]) : []
  const headHtml = columns.map((column) => `<th style="padding:12px;text-align:left">${column}</th>`).join('')
  const bodyHtml = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((column) => `<td style="padding:12px;border-top:1px solid #e2e8f0">${row[column] ?? ''}</td>`)
          .join('')}</tr>`,
    )
    .join('')

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        body { font-family: ui-sans-serif, system-ui, sans-serif; padding: 32px; color: #0f172a; }
        .summary { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; margin-bottom:24px; }
        table { width:100%; border-collapse:collapse; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="summary">${summaryHtml}</div>
      <table>
        <thead><tr>${headHtml}</tr></thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    </body>
  </html>`
}
