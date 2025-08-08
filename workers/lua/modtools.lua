-- modtools.lua
-- Redis Lua script for moderation tools

local action = ARGV[1]
local targetId = ARGV[2]
local moderatorId = ARGV[3]
local reason = ARGV[4] or 'No reason provided'
local duration = tonumber(ARGV[5]) or 3600

if action == 'ban' then
    -- Ban user
    redis.call('SETEX', 'ban:' .. targetId, duration, reason)
    redis.call('SADD', 'banned:users', targetId)
    redis.call('ZADD', 'mod:actions', redis.call('TIME')[1], 
        'ban:' .. targetId .. ':' .. moderatorId .. ':' .. reason)
    return 1
    
elseif action == 'unban' then
    -- Unban user
    redis.call('DEL', 'ban:' .. targetId)
    redis.call('SREM', 'banned:users', targetId)
    redis.call('ZADD', 'mod:actions', redis.call('TIME')[1], 
        'unban:' .. targetId .. ':' .. moderatorId)
    return 1
    
elseif action == 'mute' then
    -- Mute user in chat
    redis.call('SETEX', 'mute:' .. targetId, duration, reason)
    return 1
    
elseif action == 'unmute' then
    -- Unmute user
    redis.call('DEL', 'mute:' .. targetId)
    return 1
    
elseif action == 'checkban' then
    -- Check if user is banned
    local banned = redis.call('EXISTS', 'ban:' .. targetId)
    if banned == 1 then
        local reason = redis.call('GET', 'ban:' .. targetId)
        local ttl = redis.call('TTL', 'ban:' .. targetId)
        return {1, reason, ttl}
    end
    return {0, '', 0}
    
elseif action == 'checkmute' then
    -- Check if user is muted
    local muted = redis.call('EXISTS', 'mute:' .. targetId)
    if muted == 1 then
        local ttl = redis.call('TTL', 'mute:' .. targetId)
        return ttl
    end
    return 0
    
else
    return 0
end