{{- define "service.labels.standard" -}}
app.poros-vue-cli.io/release: {{ .Release.Name | quote }}
{{- end -}}

{{- define "service.logging.deployment.label" -}}
app.poros-vue-cli.io/logs-parser: {{ .Values.logs.parser | quote }}
{{- end -}}