-- placePixel.lua
-- Redis Lua script for placing pixels

local canvasKey = KEYS[1]
local chunkKey = KEYS[2]
local pixel = ARGV[1]
local color = ARGV[2]
local userId = ARGV[3]
local cooldown = tonumber(ARGV[4])

-- Set pixel
redis.call('SETBIT', canvasKey, pixel, 1)
redis.call('HSET', chunkKey, pixel, color)

-- Set user cooldown
if userId and cooldown > 0 then
    redis.call('SETEX', 'cd:' .. userId, cooldown, '1')
end

return 1