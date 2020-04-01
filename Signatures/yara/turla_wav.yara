rule rand_encoded_wav_turla
{
  strings:
    $RIFF = "RIFF"
    $WAVE = "WAVE"
    $MZ = {5C [-] 99 [-] 13 [-] 6F [-] F2 [-] 52}
  condition:
    $RIFF at 0 and $WAVE at 8 and $MZ at 44
}
