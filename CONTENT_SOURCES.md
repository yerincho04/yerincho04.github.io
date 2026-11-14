# Portfolio content sources

The résumé supplies roles, dates, awards, personal contributions, and the original project results. Public GitHub sources add implementation detail and links. Repository-level features are described as features of the project, without attributing every team contribution to Yerin.

| Entry | Public evidence |
| --- | --- |
| VLA world-knowledge research | [YeahPick diagnostics](https://github.com/yerincho04/YeahPick/blob/Yerin/diagnostics/README.md), [matched experiment](https://github.com/yerincho04/YeahPick/blob/Yerin/diagnostics/MATCHED_EXPERIMENT.md), [photo VQA dataset](https://github.com/yerincho04/YeahPick/blob/Yerin/VQA_dataset_v2/README.md) |
| AsyncMixVLA | [Release overview](https://github.com/yerincho04/AsyncMixVLA), [238-cell learned-trigger report](https://github.com/yerincho04/AsyncMixVLA/blob/main/results/table2_learned_k4_jointv2/v1_v2_cascade_continuous_TEST_K4_JOINTV2.md) |
| Continual robot learning | [FM-SDFT](https://github.com/yerincho04/IngChicken-FM), [velocity-space implementation](https://github.com/yerincho04/IngChicken-FM/blob/main/SDFT/fm.py), [replay baseline](https://github.com/yerincho04/cl_diffusion_ER) |
| GIFPT | [Architecture](https://github.com/yerincho04/GIFPT), [render pipeline](https://github.com/yerincho04/GIFPT/blob/dev/GIFPT_AI/studio/video_render.py), [vision/background tasks](https://github.com/yerincho04/GIFPT/blob/dev/GIFPT_AI/studio/tasks.py) |
| WinWin | [Agent and data workflow](https://github.com/yerincho04/DB_Chatbot/blob/main/db_chatbot/README.md), [evaluation](https://github.com/yerincho04/DB_Chatbot/blob/main/testing/README.md), [web application](https://github.com/yerincho04/SWAI) |
| StationGo | [Team repository and methodology](https://github.com/Daeung-03/StationGo) |
| SafeSwitch | [Conditional steering](https://github.com/yerincho04/LLM_finalproject/blob/main/run_safeswitch.py), [results](https://github.com/yerincho04/LLM_finalproject/blob/main/results/eval/summary_table.csv), [evaluation definition](https://github.com/yerincho04/LLM_finalproject/blob/main/evaluate.py) |
| Rezoom | [Application code](https://github.com/yerincho04/Rezoom/blob/main/rezoom/server.js), [SQLite storage](https://github.com/yerincho04/Rezoom/blob/main/rezoom/db.js) |
| GDGoC note service | [AI service](https://github.com/gdgoc-otp-team-3/gdgoc-otp-team-3-ai), [claim verification](https://github.com/gdgoc-otp-team-3/gdgoc-otp-team-3-ai/blob/main/src/services/factCheckService.js) |

## Interpretation notes

- YeahPick extends upstream Act2Answer. The upstream paper and its headline findings are not represented as Yerin’s publication or results.
- AsyncMixVLA percentages come from the release README; the report gives rounded values and paired comparisons. Its 238-cell timing measurements are not substituted for the résumé’s separate latency figures in the experience section.
- FM-SDFT’s 72.0% to 80.5% success-rate result and NBT values come from the résumé. Repository evidence supports the implementation and experiment structure.
- SafeSwitch figures come from the committed evaluation artifacts, with 50 prompts per split for each model. Compliance is a refusal-based proxy, not correctness.
- Rezoom’s Streamlit prototype is supported by the résumé; the public repository contains Express/EJS and SQLite. Both are described separately.
- Naver internship details remain résumé-based; no matching public project repository was identified in the accessible owner/team repositories.
- Reported ML experiments were inspected, not rerun as part of the website update.

## Repository visuals

Figures are copied unchanged from the public repositories below; They retain their original colours. Captions distinguish diagnostics from task-performance results. GitHub originals are linked alongside each visual.

- `assets/work/world-knowledge-results.png`: https://github.com/yerincho04/YeahPick/blob/Yerin/diagnostics/report/figures/behaviour_success.png
- `assets/work/asyncmixvla-results.png`: https://github.com/yerincho04/AsyncMixVLA/blob/main/figures/table2_panel_a_gains_losses.png
- `assets/work/fm-policy-drift.png`: https://github.com/yerincho04/IngChicken-FM/blob/main/drift_cosine_long.png
- `assets/work/safeswitch-results.png`: https://github.com/yerincho04/LLM_finalproject/blob/main/results/figures/fig1_main_results.png
- `assets/work/gifpt-convolution.mp4`: https://github.com/yerincho04/GIFPT/blob/dev/shared/results/videos/CNNScene/cnn_param_demo.mp4
- `assets/work/gifpt-poster.png`: thumbnail extracted from the original video with macOS Quick Look. The source video and its colours are unchanged.

The world-knowledge figure belongs to the later [photo-experiment report](https://github.com/yerincho04/YeahPick/blob/Yerin/diagnostics/report/REPORT_ko.md), not the earlier 240-rollout pilot. FM-SDFT drift is explained by [the plotting script](https://github.com/yerincho04/IngChicken-FM/blob/main/scripts/visualize_drift_extended.py); it is not a success-rate or forgetting plot. StationGo and Rezoom had no suitable explanatory diagrams among the repository assets inspected.
