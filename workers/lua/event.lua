-- event.lua
-- Redis Lua script for event management

local eventKey = KEYS[1]
local eventData = ARGV[1]
local eventType = ARGV[2] or 'pixel'
local timestamp = ARGV[3] or redis.call('TIME')[1]

-- Store event
redis.call('ZADD', eventKey, timestamp, eventData)

-- Trim old events (keep last 1000)
local count = redis.call('ZCARD', eventKey)
if count > 1000 then
    redis.call('ZREMRANGEBYRANK', eventKey, 0, count - 1001)
end

-- Publish event for real-time subscribers
redis.call('PUBLISH', 'events:' .. eventType, eventData)

return 1