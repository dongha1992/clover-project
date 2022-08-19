interface IProps {
  currentVersion?: number;
  termOfUser: any;
}

export const getTermDate = ({ currentVersion, termOfUser }: IProps): string => {
  const lastestVersion = termOfUser?.versions[termOfUser?.versions.length - 1].version;
  const isLastest = currentVersion === lastestVersion;
  const currentVersionOfDate = termOfUser?.terms.startedAt.split(' ')[0];

  return isLastest ? `${currentVersionOfDate} (현재)` : `${currentVersionOfDate}`;
};
