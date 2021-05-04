# FCS File Validator

Validates files for conformance to the Flow Cytometry Standard (FCS)
specifications.

Runs entirely in your Web browser; files are not uploaded to a server. Use it
here: https://primitybio.github.io/fcs-validator/

This focuses on violations that are more likely to cause FCS file readers to
fail when parsing events out of an FCS file, and that we found to be common when
surveying FCS files from more than 50 different instrument manufacturers and
software versions. For example, it looks for:

  * Empty keyword values.
  * Duplicate keywords.
  * Missing required keywords.
  * Unacceptable custom keywords.
  * Incorrect `DATA` segment coordinates.
  * Truncated files.
  * Proper values for `$PnE`, `$PnB`, `$BYTEORD`, `$PnD`, `$PnG`, `$COMP`,
    `$SPILLOVER` and all numeric keywords.
  * (More, this list is not exhaustive.)

It does not inspect:

  * The CRC value, because it is generally ignored.
  * The `STEXT`, `OTHER` or `ANALYSIS` segments, because those do not affect the
    list-mode data (events).

This applies specific testing criteria for FCS2.0, FSC3.0, FCS3.1, FCS3.2 and
FCS4.0. Note that FCS4.0 validation is based on a draft of the FCS4.0
specification, as that specification has not yet been published.

Note that it is very common for vendors to produce files that use standard
keywords (ones beginning with `$`) defined in the next version, e.g. to use a
keyword that was standardized in FCS3.0 in an FCS2.0 file.
