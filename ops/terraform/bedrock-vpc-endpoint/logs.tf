# =============================================================================
# Bedrock Model Invocation Logging — for evidence-pack reproduction + audit
# =============================================================================
#
# CMS-0057-F § IV.D requires every adverse-determination decision to be
# reproducible for 7 years. Bedrock model invocation logs (input + output
# capture, redacted by Guardrails) are the underlying evidence; this module
# materializes the CloudWatch Logs sink + the IAM role Bedrock assumes to
# write to it.

resource "aws_cloudwatch_log_group" "bedrock_invocations" {
  name              = "/aws/bedrock/authrex-invocations"
  retention_in_days = var.model_invocation_log_retention_days
  tags              = { Name = "authrex-bedrock-invocations", Compliance = "CMS-0057-F-IV-D" }
}

data "aws_iam_policy_document" "bedrock_logging_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["bedrock.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
  }
}

resource "aws_iam_role" "bedrock_logging" {
  name               = "authrex-bedrock-logging-role"
  assume_role_policy = data.aws_iam_policy_document.bedrock_logging_assume.json
  tags               = { Name = "authrex-bedrock-logging-role" }
}

resource "aws_iam_role_policy" "bedrock_logging" {
  role = aws_iam_role.bedrock_logging.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ]
      Resource = "${aws_cloudwatch_log_group.bedrock_invocations.arn}:*"
    }]
  })
}

# NOTE: Bedrock model-invocation logging itself is configured via the
# `aws_bedrock_model_invocation_logging_configuration` resource (one per
# account/region). It's intentionally NOT in this module to avoid managing
# it from multiple modules. Configure it once via:
#
#   aws bedrock put-model-invocation-logging-configuration \
#     --logging-config '{
#       "cloudWatchConfig": {
#         "logGroupName": "/aws/bedrock/authrex-invocations",
#         "roleArn": "arn:aws:iam::ACCOUNT:role/authrex-bedrock-logging-role"
#       },
#       "textDataDeliveryEnabled": true,
#       "imageDataDeliveryEnabled": false,
#       "embeddingDataDeliveryEnabled": false
#     }'
