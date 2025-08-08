-- rankingEvent.lua
-- Redis Lua script for ranking events

local rankingKey = KEYS[1]
local userId = ARGV[1]
local score = tonumber(ARGV[2])

-- Update user ranking
redis.call('ZINCRBY', rankingKey, score, userId)

-- Get user rank
local rank = redis.call('ZREVRANK', rankingKey, userId)

return rank