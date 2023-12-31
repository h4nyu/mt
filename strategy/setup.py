from setuptools import find_packages, setup

requires = open("./requirements.txt").read().splitlines()

setup(
    name="strategy",
    version="0.1.0",
    packages=find_packages(),
    install_requires=requires,
    package_data={"deep": ["py.typed"]},
    extras_require={
        "dev": [
            "pytest",
            "pytest-mypy",
            "black",
            "mypy",
        ]
    },
)
