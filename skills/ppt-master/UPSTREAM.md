# PPT Master upstream

- Source: https://github.com/hugohe3/ppt-master/tree/main/skills/ppt-master
- Imported commit: `680de11f1bef4628b68d5daad9dffec569fbd51f`
- Skill version: `6.6.0`
- License: MIT; see [LICENSE](LICENSE).
- Packaging: The upstream `skills/ppt-master/` directory is bundled without modifications. This file records provenance for updates in this repository.

The skill requires Python 3.10+ and the packages in `requirements.txt` for its post-processing scripts. Install those dependencies in the environment that will run the skill:

```powershell
py -3 -m pip install -r "<installed-skill-directory>\requirements.txt"
```

When installed through the Codex marketplace, locate the installed copy of `ppt-master` and use its `requirements.txt`. Keep the skill's attribution files and scripts together; `scripts/attribution_guard.py` checks their integrity before use.
