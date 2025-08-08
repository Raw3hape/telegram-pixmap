-- getUserRanks.lua
-- Redis Lua script for getting user rankings

local dailyKey = KEYS[1]
local totalKey = KEYS[2]
local userId = ARGV[1]

local ranks = {}

-- Get daily rank
local dailyRank = redis.call('ZREVRANK', dailyKey, userId)
if dailyRank then
    ranks['daily'] = dailyRank + 1
    ranks['dailyScore'] = redis.call('ZSCORE', dailyKey, userId) or 0
else
    ranks['daily'] = 0
    ranks['dailyScore'] = 0
end

-- Get total rank
local totalRank = redis.call('ZREVRANK', totalKey, userId)
if totalRank then
    ranks['total'] = totalRank + 1
    ranks['totalScore'] = redis.call('ZSCORE', totalKey, userId) or 0
else
    ranks['total'] = 0
    ranks['totalScore'] = 0
end

-- Get top 10 daily
local top10Daily = redis.call('ZREVRANGE', dailyKey, 0, 9, 'WITHSCORES')
ranks['top10Daily'] = top10Daily

-- Get top 10 total
local top10Total = redis.call('ZREVRANGE', totalKey, 0, 9, 'WITHSCORES')
ranks['top10Total'] = top10Total

return cjson.encode(ranks)