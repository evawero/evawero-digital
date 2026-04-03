-- Add image_data column for storing generated graphics (base64 PNG)
ALTER TABLE content_calendar ADD COLUMN IF NOT EXISTS image_data TEXT;
