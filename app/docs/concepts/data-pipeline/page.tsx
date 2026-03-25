import { Breadcrumb, Callout, CodeBlock, TOC, PageFooter } from "@/components/DocsUI";

export const metadata = { title: "Data Pipeline — Artemis Docs" };

export default function DataPipelinePage() {
  return (
    <div className="flex">
      <article className="flex-1 min-w-0 px-6 py-10 sm:px-10 sm:py-14 max-w-3xl">
        <Breadcrumb crumbs={[{ label: "docs", href: "/docs" }, { label: "concepts", href: "/docs/concepts/data-pipeline" }, { label: "data pipeline" }]} />

        <h1 className="text-4xl sm:text-5xl font-normal text-white tracking-tight leading-[1.1] mb-4">
          Data Pipeline
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed mb-8">
          How Artemis ingests, preprocesses, stores, and manages your training datasets.
        </p>
        <hr className="border-white/10 mb-8" />

        {/* Supported formats */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="formats">Supported Data Formats</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">
          Artemis accepts robotics data in a wide range of standard formats. Files are automatically detected and parsed on upload:
        </p>
        <div className="overflow-x-auto my-5">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-white/10 bg-white/4">
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Format</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Extension</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Use Case</th>
              </tr>
            </thead>
            <tbody>
              {[
                { fmt: "ROS Bag",        ext: ".bag, .db3", use: "Full ROS 2 topic recordings — preferred format." },
                { fmt: "CSV Telemetry",  ext: ".csv",       use: "Tabular sensor readings, joint states, or IMU data." },
                { fmt: "Image Archive",  ext: ".zip, .tar.gz", use: "Labelled image sets for object detection tasks." },
                { fmt: "LIDAR Cloud",    ext: ".pcd, .bin", use: "Point cloud data from 3D LIDAR sensors." },
                { fmt: "JSON Telemetry", ext: ".json, .jsonl", use: "Arbitrary structured sensor data." },
                { fmt: "HDF5",           ext: ".h5, .hdf5", use: "Large multi-modal datasets with metadata." },
              ].map((row, i) => (
                <tr key={row.fmt} className={`border-b border-white/6 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                  <td className="px-4 py-3 text-xs text-zinc-300 font-medium">{row.fmt}</td>
                  <td className="px-4 py-3 font-mono text-xs text-cyan-400/80">{row.ext}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Uploading */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="uploading">Uploading Data</h2>
        <p className="text-zinc-400 leading-relaxed mb-2">Upload a dataset with the CLI:</p>
        <CodeBlock lang="bash">{`kairo data upload ./recording.bag \\
  --robot rob_a1b2c3d4 \\
  --label "arm-training-run-3" \\
  --tags "production,v2"`}</CodeBlock>
        <p className="text-zinc-400 leading-relaxed mb-2">For large datasets, uploads are chunked and resumable:</p>
        <CodeBlock lang="bash">{`# If an upload is interrupted, resume it
kairo data resume --upload-id upl_xyz789`}</CodeBlock>

        <Callout type="info">
          Datasets larger than 500 MB are automatically split into 100 MB chunks and uploaded in parallel. Progress is visible in the dashboard under <strong>Data → Uploads</strong>.
        </Callout>

        {/* Preprocessing */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="preprocessing">Automatic Preprocessing</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          After upload, Artemis runs an automatic preprocessing pipeline before training:
        </p>
        <ul className="flex flex-col gap-3 mb-5 text-sm">
          {[
            { step: "Validation",    desc: "Checks file integrity, detects corrupt frames, and validates message schemas." },
            { step: "Normalisation", desc: "Scales sensor values to a consistent range per topic type." },
            { step: "Resampling",    desc: "Aligns multi-topic recordings to a unified timestamp grid." },
            { step: "Augmentation",  desc: "Applies optional data augmentation (noise injection, frame flipping) to improve model generalisation." },
            { step: "Train/Val split", desc: "Automatically splits data into 80% training and 20% validation sets." },
          ].map((s) => (
            <li key={s.step} className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
              <div>
                <span className="text-white font-medium">{s.step}</span>
                <span className="text-zinc-500"> — {s.desc}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Storage limits */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="storage">Storage Limits</h2>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-white/10 bg-white/4">
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Plan</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Storage</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Max File Size</th>
                <th className="text-left px-4 py-3 text-zinc-400 font-medium text-xs">Retention</th>
              </tr>
            </thead>
            <tbody>
              {[
                { plan: "Starter",  storage: "1 GB",   max: "500 MB",  ret: "90 days" },
                { plan: "Builder",  storage: "50 GB",  max: "10 GB",   ret: "1 year" },
                { plan: "Pro",      storage: "500 GB", max: "100 GB",  ret: "Unlimited" },
              ].map((row, i) => (
                <tr key={row.plan} className={`border-b border-white/6 ${i % 2 === 0 ? "" : "bg-white/2"}`}>
                  <td className="px-4 py-3 text-xs text-zinc-300">{row.plan}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">{row.storage}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-400">{row.max}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{row.ret}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout type="warning">
          When you reach 80% of your storage quota, Artemis sends an email alert. At 100%, new uploads are paused — existing data and active deployments are unaffected.
        </Callout>

        {/* Data management */}
        <h2 className="text-2xl font-normal text-white mt-10 mb-3" id="management">Managing Datasets</h2>
        <CodeBlock lang="bash">{`# List all datasets
kairo data list

# Show details and preprocessing status
kairo data info --dataset ds_xyz123

# Delete a dataset (irreversible)
kairo data delete --dataset ds_xyz123`}</CodeBlock>

        <Callout type="tip">
          Deleting a dataset does not delete any models that were trained from it. Model weights are stored separately and are unaffected by dataset deletion.
        </Callout>

        <PageFooter
          prev={{ label: "AI Models", href: "/docs/concepts/models" }}
          next={{ label: "ROS 2 Guide", href: "/docs/ros2-guide" }}
        />
      </article>

      <TOC items={[
        { label: "Supported Formats", href: "#formats" },
        { label: "Uploading Data",    href: "#uploading" },
        { label: "Preprocessing",     href: "#preprocessing" },
        { label: "Storage Limits",    href: "#storage" },
        { label: "Managing Datasets", href: "#management" },
      ]} />
    </div>
  );
}
