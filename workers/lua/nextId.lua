-- nextId.lua  
-- Redis Lua script for generating IDs

local key = KEYS[1]
local id = redis.call('INCR', key)
return id