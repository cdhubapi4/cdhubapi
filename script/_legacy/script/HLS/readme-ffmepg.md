# ffmpeg guide

1. make intro image

   - `ffmpeg -i a6xrrcvvxao7xzt8imhh.mp4 -ss 00:00:00 -frames:v 1 a6xrrcvvxao7xzt8imhh_intro.png`

2. make m3u8 5sec/ts

   - `ffmpeg -i a6xrrcvvxao7xzt8imhh.mp4 -profile:v baseline -level 3.0 -start_number 0 -hls_time 5 -hls_list_size 0 -f hls a6xrrcvvxao7xzt8imhh.m3u8`
   - rotate 90 deg: `-vf "transpose=1"`

3. make folder with intro image and m3u8
