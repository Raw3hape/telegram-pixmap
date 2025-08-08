-- zmRankRev.lua
-- Redis Lua script for reverse ranking operations

local key = KEYS[1]
local member = ARGV[1]
local action = ARGV[2] or 'rank'
local count = tonumber(ARGV[3]) or 10

if action == 'rank' then
    -- Get reverse rank of member
    local rank = redis.call('ZREVRANK', key, member)
    if rank then
        return rank + 1
    else
        return 0
    end
    
elseif action == 'score' then
    -- Get score of member
    local score = redis.call('ZSCORE', key, member)
    return score or 0
    
elseif action == 'top' then
    -- Get top N members with scores
    local results = redis.call('ZREVRANGE', key, 0, count - 1, 'WITHSCORES')
    return results
    
elseif action == 'around' then
    -- Get members around a specific rank
    local rank = redis.call('ZREVRANK', key, member)
    if rank then
        local start = math.max(0, rank - 5)
        local stop = rank + 5
        local results = redis.call('ZREVRANGE', key, start, stop, 'WITHSCORES')
        return results
    else
        return {}
    end
    
elseif action == 'count' then
    -- Get total count
    local total = redis.call('ZCARD', key)
    return total
    
else
    return 0
end