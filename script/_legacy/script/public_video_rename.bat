@echo off
setlocal enabledelayedexpansion

set /a "count=1"

for %%f in (*.mp4) do (
  ren "%%f" "v!count!.mp4"
  set /a "count+=1"
)