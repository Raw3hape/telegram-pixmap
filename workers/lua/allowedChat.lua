-- allowedChat.lua
-- Redis Lua script for managing allowed chat channels

local chatKey = KEYS[1]
local channelId = ARGV[1]
local action = ARGV[2] or 'check'

if action == 'add' then
    -- Add channel to allowed list
    redis.call('SADD', chatKey, channelId)
    return 1
elseif action == 'remove' then
    -- Remove channel from allowed list
    redis.call('SREM', chatKey, channelId)
    return 1
elseif action == 'check' then
    -- Check if channel is allowed
    local isAllowed = redis.call('SISMEMBER', chatKey, channelId)
    return isAllowed
else
    -- List all allowed channels
    local channels = redis.call('SMEMBERS', chatKey)
    return channels
end