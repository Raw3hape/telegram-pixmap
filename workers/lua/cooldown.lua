-- cooldown.lua
-- Redis Lua script for managing user cooldowns

local cdKey = KEYS[1]
local userId = ARGV[1]
local cooldownTime = tonumber(ARGV[2]) or 5
local action = ARGV[3] or 'set'

if action == 'set' then
    -- Set cooldown for user
    redis.call('SETEX', 'cd:' .. userId, cooldownTime, '1')
    return cooldownTime
elseif action == 'check' then
    -- Check remaining cooldown
    local ttl = redis.call('TTL', 'cd:' .. userId)
    if ttl > 0 then
        return ttl
    else
        return 0
    end
elseif action == 'reset' then
    -- Reset cooldown
    redis.call('DEL', 'cd:' .. userId)
    return 0
else
    return 0
end