-- voidEvent.lua
-- Redis Lua script for void/hourly event management

local eventKey = KEYS[1]
local canvasKey = KEYS[2]
local x = tonumber(ARGV[1])
local y = tonumber(ARGV[2])
local radius = tonumber(ARGV[3]) or 10
local action = ARGV[4] or 'start'

if action == 'start' then
    -- Start void event at position
    redis.call('HSET', eventKey, 'active', '1')
    redis.call('HSET', eventKey, 'x', x)
    redis.call('HSET', eventKey, 'y', y)
    redis.call('HSET', eventKey, 'radius', radius)
    redis.call('HSET', eventKey, 'startTime', redis.call('TIME')[1])
    
    -- Mark affected pixels
    for dx = -radius, radius do
        for dy = -radius, radius do
            if dx*dx + dy*dy <= radius*radius then
                local px = x + dx
                local py = y + dy
                local pixelIndex = py * 65536 + px
                redis.call('SETBIT', canvasKey .. ':void', pixelIndex, 1)
            end
        end
    end
    
    return 1
    
elseif action == 'stop' then
    -- Stop void event
    redis.call('HSET', eventKey, 'active', '0')
    redis.call('DEL', canvasKey .. ':void')
    return 1
    
elseif action == 'check' then
    -- Check if event is active
    local active = redis.call('HGET', eventKey, 'active')
    return active or '0'
    
else
    -- Get event status
    local status = redis.call('HGETALL', eventKey)
    return status
end