provider "aws" {
  region = "ap-southeast-2"
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "bsf-terraform-state-bucket"
}

resource "aws_dynamodb_table" "terraform_lock" {
  name         = "bsf-terraform-lock-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}

# S3 Bucket
resource "aws_s3_bucket" "bsf_bucket" {
  bucket = var.bucket_name
}


resource "aws_s3_bucket_policy" "bsf_bucket_policy" {
  bucket = aws_s3_bucket.bsf_bucket.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          AWS = ["arn:aws:iam::713292987965:role/OIDC_role", aws_cloudfront_origin_access_identity.oai.iam_arn]
        },
        Action   = "s3:*",
        Resource = "${aws_s3_bucket.bsf_bucket.arn}/*"
      }
    ]
  })
}
resource "aws_s3_object" "bsf_build_files" {
  for_each = fileset("${path.module}/../build", "**")
  bucket   = aws_s3_bucket.bsf_bucket.id
  key      = each.key
  source   = "${path.module}/../build/${each.key}"
  content_type = lookup(
    {
      html = "text/html",
      css  = "text/css",
      js   = "application/javascript",
      png  = "image/png",
      jpg  = "image/jpeg"
    },
    split(".", each.key)[length(split(".", each.key)) - 1],
    "application/octet-stream"
  )
}

# S3 Bucket Website Configuration
resource "aws_s3_bucket_website_configuration" "bsf_website" {
  bucket = aws_s3_bucket.bsf_bucket.id

  index_document {
    suffix = "index.html"
  }
}

# Dedicated S3 Bucket for CloudFront Logs
resource "aws_s3_bucket" "log_bucket" {
  bucket = "bs-frontend-logs"

  tags = {
    Environment = "Production"
    Purpose     = "CloudFront Logs"
  }
}

resource "aws_s3_bucket_ownership_controls" "ownership_control" {
  bucket = aws_s3_bucket.bsf_bucket.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# Configure S3 Bucket Logging
resource "aws_s3_bucket_logging" "logging" {
  bucket        = aws_s3_bucket.bsf_bucket.id
  target_bucket = aws_s3_bucket.log_bucket.id
  target_prefix = "cloudfront-logs/"
}

# Upload the index.html File
resource "aws_s3_object" "index_file" {
  bucket       = aws_s3_bucket.bsf_bucket.id
  key          = "index.html"
  source       = "${path.module}/../build/index.html"
  content_type = "text/html"
}

resource "aws_s3_bucket_metric" "frontend_metrics" {
  bucket = aws_s3_bucket.bsf_bucket.id

  name = "FrontendMetrics"

  filter {
    prefix = "/"
  }
}



resource "aws_cloudfront_distribution" "bsf_distribution" {
  enabled = true

  origin {
    domain_name = aws_s3_bucket.bsf_bucket.bucket_regional_domain_name
    origin_id   = "frontend-origin"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "frontend-origin"
    viewer_protocol_policy = "redirect-to-https"
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  logging_config {
    bucket          = aws_s3_bucket.bsf_bucket.bucket_regional_domain_name
    include_cookies = true
    prefix          = "cloudfront-logs/"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# CloudFront Origin Access Identity (OAI)
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "Access Identity for CloudFront to access S3"
}

# Output the CloudFront URL
output "frontend_url" {
  value = aws_cloudfront_distribution.bsf_distribution.domain_name
}

output "bsf_bucket_name" {
  value = aws_s3_bucket.bsf_bucket.bucket
}
