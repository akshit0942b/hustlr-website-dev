-- ============================================================================
-- HUSTLR SCORING SCHEMA MIGRATION
-- Version: 002
-- Date: 2026-03-07
-- Purpose: Add scoring columns + config table for the scoring engine
-- ============================================================================

-- ============================================================================
-- STEP 1: ADD SCORING COLUMNS TO vettingapplications
-- ============================================================================

-- Per-category score breakdown (e.g. { cgpa: { raw: 8, normalized: 0.8, weighted: 8.0 }, ... })
ALTER TABLE public.vettingapplications
ADD COLUMN IF NOT EXISTS scores jsonb DEFAULT NULL;

-- Final scaled score 0-100
ALTER TABLE public.vettingapplications
ADD COLUMN IF NOT EXISTS final_score numeric DEFAULT NULL;

-- When was this application last scored
ALTER TABLE public.vettingapplications
ADD COLUMN IF NOT EXISTS scored_at timestamptz DEFAULT NULL;

-- Cached GitHub API / Gemini responses to avoid redundant API calls
ALTER TABLE public.vettingapplications
ADD COLUMN IF NOT EXISTS scoring_cache jsonb DEFAULT NULL;

-- ============================================================================
-- STEP 2: INDEX ON final_score FOR SORTING
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_vettingapplications_final_score
ON public.vettingapplications (final_score DESC NULLS LAST);

-- ============================================================================
-- STEP 3: CREATE SCORING CONFIG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.scoring_config (
  id serial PRIMARY KEY,
  category text UNIQUE NOT NULL,
  weight numeric NOT NULL,
  enabled boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- STEP 4: SEED DEFAULT WEIGHTS (matches scoring-docs)
-- Weights: internships=30, open_source=35, projects=25, hackathons=20,
--          research=20, cp_platform=15, cp_competitions=15, skills=10, cgpa=10
-- Total: 180% (or 165% when research field doesn't match category)
-- ============================================================================

INSERT INTO public.scoring_config (category, weight, enabled) VALUES
  ('internships', 30, true),
  ('open_source', 35, true),
  ('projects', 25, true),
  ('hackathons', 20, true),
  ('research', 20, true),
  ('cp_platform', 15, true),
  ('cp_competitions', 15, true),
  ('skills', 10, true),
  ('cgpa', 10, true)
ON CONFLICT (category) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES (run after migration to confirm)
-- ============================================================================

-- Check new columns exist:
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'vettingapplications'
--   AND column_name IN ('scores', 'final_score', 'scored_at', 'scoring_cache');

-- Check config table has 9 rows:
-- SELECT * FROM scoring_config ORDER BY weight DESC;

-- Check weights sum to 180:
-- SELECT SUM(weight) as total_weight FROM scoring_config WHERE enabled = true;

-- ============================================================================
-- ROLLBACK (if needed)
-- ============================================================================
-- ALTER TABLE public.vettingapplications DROP COLUMN IF EXISTS scores;
-- ALTER TABLE public.vettingapplications DROP COLUMN IF EXISTS final_score;
-- ALTER TABLE public.vettingapplications DROP COLUMN IF EXISTS scored_at;
-- ALTER TABLE public.vettingapplications DROP COLUMN IF EXISTS scoring_cache;
-- DROP INDEX IF EXISTS idx_vettingapplications_final_score;
-- DROP TABLE IF EXISTS public.scoring_config;
