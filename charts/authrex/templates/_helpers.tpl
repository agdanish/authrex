{{/* vim: set filetype=mustache: */}}

{{/* fully-qualified release name */}}
{{- define "authrex.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/* common labels */}}
{{- define "authrex.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: authrex
authrex.health/cell-id: {{ .Values.global.cellId | quote }}
authrex.health/region:  {{ .Values.global.region | quote }}
authrex.health/environment: {{ .Values.global.environment | quote }}
{{- end }}

{{/* selector labels */}}
{{- define "authrex.selectorLabels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/* image with auto-tag fallback */}}
{{- define "authrex.image" -}}
{{- $reg := .Values.global.imageRegistry -}}
{{- $repo := .repository -}}
{{- $tag := default $.Values.global.imageTag .Chart.AppVersion -}}
{{- printf "%s/%s:%s" $reg $repo $tag -}}
{{- end }}
