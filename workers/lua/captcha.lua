-- captcha.lua
-- Redis Lua script for captcha management

local captchaKey = KEYS[1]
local userId = ARGV[1]
local action = ARGV[2] or 'check'
local captchaValue = ARGV[3]

if action == 'set' then
    -- Set captcha for user
    redis.call('SETEX', captchaKey .. ':' .. userId, 120, captchaValue)
    return 1
elseif action == 'verify' then
    -- Verify captcha
    local stored = redis.call('GET', captchaKey .. ':' .. userId)
    if stored == captchaValue then
        redis.call('DEL', captchaKey .. ':' .. userId)
        return 1
    end
    return 0
else
    -- Check if user needs captcha
    local exists = redis.call('EXISTS', captchaKey .. ':' .. userId)
    return exists
end