import React from 'react';
import json2csv from 'json2csv';
import Blob from 'blob';
import FileSaver from 'file-saver';
// data
import rdf from 'test/data/rdf_RM_2016.json';

type Props = {
  json: {
    name: string;
    data: Array<{
      day: number;
      hour: number;
      hour_of_year: number;
      hourly_limit: number;
      regional_loaw_mw: number;
      year: number;
    }>;
  };
};

const DownloadLink = (props: Props) => {
  const { json } = props;

  const title = json.name;
  const data = json.data;
  const fields = Object.keys(data[0]);

  return (
    <a
      href=""
      onClick={(event) => {
        event.preventDefault();
        try {
          const csv = json2csv({ fields, data });
          const blob = new Blob([csv], { type: 'text/plain:charset=utf-8' });
          FileSaver.saveAs(blob, `${title}.csv`);
        } catch (err) {
          console.error(err);
        }
      }}
    >
      {title}
    </a>
  );
};

const RdfCsvDownloads = (props: {}) => {
  const { regional_load } = rdf;
  const { generation, so2, nox, co2, pm25 } = rdf.data;

  const fields = [
    { name: 'regional_load', data: regional_load },
    { name: 'generation', data: generation },
    { name: 'so2', data: so2 },
    { name: 'nox', data: nox },
    { name: 'co2', data: co2 },
    { name: 'pm25', data: pm25 },
  ];

  return (
    <div>
      {fields.map((field, index) => (
        <p key={index}>
          <DownloadLink json={field} />
        </p>
      ))}
    </div>
  );
};

export default RdfCsvDownloads;
